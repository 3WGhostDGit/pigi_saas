import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

// TODO: Define proper types for activity data
interface RecentSalesProps {
  data: any[];
}

// TODO: Fetch real data and map through it
export function RecentSales({ data }: RecentSalesProps) {
  // Placeholder structure based on the image/HTML
  const placeholderActivities = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', value: '+$1,999.00', avatar: '/avatars/01.png' },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', value: '+$39.00', avatar: '/avatars/02.png' },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', value: '+$299.00', avatar: '/avatars/03.png' },
    { name: 'William Kim', email: 'will@email.com', value: '+$99.00', avatar: '/avatars/04.png' },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', value: '+$39.00', avatar: '/avatars/05.png' },
  ];

  return (
    <div className="space-y-8">
      {placeholderActivities.map((activity, index) => (
          <div key={index} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.avatar} alt="Avatar" />
              <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{activity.name}</p>
              <p className="text-sm text-muted-foreground">{activity.email}</p>
            </div>
            <div className="ml-auto font-medium">{activity.value}</div>
          </div>
      ))}
      {placeholderActivities.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">No recent activity.</p>
      )}
    </div>
  )
} 