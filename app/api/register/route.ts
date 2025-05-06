import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/lib/validators/auth";
import * as z from "zod";

export async function POST(req: Request) {
  try {
    console.log("Registration API called");
    const body = await req.json();
    console.log("Request body:", body);

    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation Error:", validation.error.errors);
      return new NextResponse(
        JSON.stringify({ message: "Données invalides", errors: validation.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    const { email, name, password } = validation.data;
    console.log("Validated data - email:", email, "name:", name);

    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      console.log("Database connection successful");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return new NextResponse(
        JSON.stringify({ message: "Erreur de connexion à la base de données" }),
        { status: 500 }
      );
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log("User already exists with email:", email);
        return new NextResponse(
          JSON.stringify({ message: "Un utilisateur avec cet email existe déjà." }),
          { status: 409 } // Conflict
        );
      }
    } catch (findError) {
      console.error("Error checking existing user:", findError);
      return new NextResponse(
        JSON.stringify({ message: "Erreur lors de la vérification de l'utilisateur existant" }),
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          hashedPassword,
          // Assign a default role if needed
          roles: {
            create: {
              role: {
                connectOrCreate: {
                  where: { name: "Employee" },
                  create: { name: "Employee", description: "Regular employee with basic access" }
                }
              }
            }
          }
        },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });

      console.log("User created successfully:", newUser.id);

      // Don't return the hashed password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword: _, ...userWithoutPassword } = newUser;

      return NextResponse.json({ user: userWithoutPassword, message: "Utilisateur créé avec succès" }, { status: 201 });
    } catch (createError) {
      console.error("Error creating user:", createError);
      return new NextResponse(
        JSON.stringify({
          message: "Erreur lors de la création de l'utilisateur",
          details: createError instanceof Error ? createError.message : String(createError)
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration Error:", error);
    // Generic error handling
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ message: "Erreur de validation interne", errors: error.errors }), { status: 400 });
    }
    return new NextResponse(
      JSON.stringify({
        message: "Une erreur interne est survenue.",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}