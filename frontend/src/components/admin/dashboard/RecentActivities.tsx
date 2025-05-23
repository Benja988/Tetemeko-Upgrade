import {
  UserIcon,
  MicIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  MessageCircleIcon,
  SendIcon,
} from 'lucide-react';

type ActivityType = 'user' | 'podcast' | 'order' | 'payment' | 'comment' | 'send';

interface Activity {
  activity: string;
  time: string;
  type: ActivityType;
}

const activities: Activity[] = [
  { activity: 'New user registered', time: '2 mins ago', type: 'user' },
  { activity: 'Podcast "Tech Talk" uploaded', time: '30 mins ago', type: 'podcast' },
  { activity: 'Order #1235 placed', time: '1 hour ago', type: 'order' },
  { activity: 'Payment received from user #0987', time: '3 hours ago', type: 'payment' },
  { activity: 'New comment on episode "Marketing 101"', time: '6 hours ago', type: 'comment' },
  { activity: 'Newsletter campaign sent', time: '1 day ago', type: 'send' },
];

const activityIcons: Record<ActivityType, { icon: React.ElementType; color: string }> = {
  user: { icon: UserIcon, color: 'bg-blue-500' },
  podcast: { icon: MicIcon, color: 'bg-purple-500' },
  order: { icon: ShoppingBagIcon, color: 'bg-orange-500' },
  payment: { icon: CreditCardIcon, color: 'bg-green-500' },
  comment: { icon: MessageCircleIcon, color: 'bg-yellow-500' },
  send: { icon: SendIcon, color: 'bg-pink-500' },
};

export default function RecentActivities() {
  return (
    <section className="bg-gradient-to-br from-white via-slate-50 to-white p-6 rounded-2xl shadow-lg transition-all duration-300">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Recent Activities</h2>

      <div className="relative border-l-4 border-gradient-to-b from-blue-400 via-purple-400 to-pink-400 pl-6 space-y-6">
        {activities.slice(0, 5).map((item, idx) => {
          const { icon: Icon, color } = activityIcons[item.type];

          return (
            <div
              key={idx}
              className="relative flex items-start group hover:bg-gray-50 rounded-xl p-3 transition duration-300"
            >
              {/* Icon Bubble */}
              <div className={`absolute -left-7 top-2 w-5 h-5 rounded-full flex items-center justify-center ${color} text-white shadow-md`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Content */}
              <div className="flex justify-between w-full items-center">
                <p className="text-gray-800 font-medium">{item.activity}</p>
                <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
