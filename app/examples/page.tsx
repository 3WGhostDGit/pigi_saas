import Link from "next/link"

export default function ExamplesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Component Examples</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/examples/data-table" className="text-blue-500 hover:underline">
            Data Table Example
          </Link>
        </li>
      </ul>
    </div>
  )
}
