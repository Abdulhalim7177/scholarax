import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    CalendarDays,
    CheckSquare,
    ChevronRight,
    LayoutDashboard,
    MessageCircle,
    Settings,
    UserRound,
    UsersRound,
} from 'lucide-react';

import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

const comingSoon = (feature: string) =>
    `/mentor-coming-soon?feature=${encodeURIComponent(feature)}`;

const mentorNavItems: NavItem[] = [
    { title: 'Overview', href: '/mentor-dashboard', icon: LayoutDashboard },
    {
        title: 'Review queue',
        href: '/mentor-review-queue',
        icon: CheckSquare,
    },
    { title: 'My learners', href: '/mentor-learners', icon: UsersRound },
    {
        title: 'Sessions',
        href: '/mentor-sessions',
        icon: CalendarDays,
    },
    {
        title: 'Impact & insights',
        href: '/mentor-impact',
        icon: BarChart3,
    },
    {
        title: 'Mentor profile',
        href: '/mentor-profile',
        icon: UserRound,
    },
    { title: 'Settings', href: comingSoon('Mentor settings'), icon: Settings },
];

const fallbackMentor: User = {
    id: 0,
    name: 'Dr. Maya Chen',
    email: 'maya@example.com',
    // avatar: null,
    email_verified_at: null,
    created_at: '',
    updated_at: '',
};

function MentorSidebarProfile() {
    const { auth } = usePage().props as { auth?: { user?: User } };
    const { state, isMobile } = useSidebar();
    const user = auth?.user ?? fallbackMentor;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="h-14 rounded-xl px-2 text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10"
                        >
                            <Avatar className="size-9 shrink-0 overflow-hidden rounded-full border-2 border-white/60">
                                <AvatarImage
                                    src={user.avatar ?? undefined}
                                    alt={user.name}
                                />
                                <AvatarFallback className="bg-scholarly-blue text-xs font-bold text-white">
                                    MC
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid min-w-0 flex-1 text-left leading-tight">
                                <span className="truncate text-[13px] font-semibold text-white">
                                    {user.name || 'Dr. Maya Chen'}
                                </span>
                                <span className="truncate text-[11px] text-white/55">
                                    Mentor
                                </span>
                            </div>
                            <ChevronRight className="ml-auto size-4 text-white/65" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 rounded-xl"
                        align="start"
                        side={
                            isMobile
                                ? 'top'
                                : state === 'collapsed'
                                  ? 'right'
                                  : 'top'
                        }
                        sideOffset={8}
                    >
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export function MentorSidebar() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="[&_[data-sidebar=sidebar]]:bg-scholarly-navy [&_[data-sidebar=sidebar]]:text-white"
        >
            <SidebarHeader className="px-4 pt-5 pb-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-10 rounded-lg px-0 text-white hover:bg-transparent hover:text-white"
                        >
                            <Link href="/mentor-dashboard" prefetch>
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-scholarly-blue text-white">
                                    <BookOpen className="size-[18px] fill-current" />
                                </span>
                                <span className="ml-1 text-[17px] font-bold tracking-[-0.02em]">
                                    Scholarly
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-1">
                <SidebarMenu className="gap-1">
                    {mentorNavItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href)}
                                tooltip={{ children: item.title }}
                                className="h-10 rounded-lg px-3 text-[13px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white data-[active=true]:bg-scholarly-blue data-[active=true]:text-white data-[active=true]:shadow-sm"
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <item.icon className="size-[17px]" />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 p-3">
                <MentorSidebarProfile />
            </SidebarFooter>
        </Sidebar>
    );
}
