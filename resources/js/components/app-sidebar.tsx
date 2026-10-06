import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    ChevronRight,
    FileText,
    LayoutGrid,
    Search,
    Settings,
    UsersRound,
} from 'lucide-react';

import aminaAvatar from '../../images/amina-avatar.png';
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
    `/coming-soon?feature=${encodeURIComponent(feature)}`;

const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    {
        title: 'Find scholarships',
        href: comingSoon('Scholarship search'),
        icon: Search,
    },
    {
        title: 'My applications',
        href: comingSoon('My applications'),
        icon: FileText,
    },
    {
        title: 'CV & SOP builder',
        href: comingSoon('CV and SOP builder'),
        icon: FileText,
    },
    { title: 'Mentors', href: comingSoon('Mentors'), icon: UsersRound },
    {
        title: 'Deadlines',
        href: comingSoon('Deadlines'),
        icon: CalendarDays,
    },
];

const fallbackUser: User = {
    id: 0,
    name: 'Amina Yusuf',
    email: 'amina@example.com',
    avatar: aminaAvatar,
    email_verified_at: null,
    created_at: '',
    updated_at: '',
};

function SidebarProfile() {
    const { auth } = usePage().props as { auth?: { user?: User } };
    const { state, isMobile } = useSidebar();
    const user = auth?.user ?? fallbackUser;

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
                                    src={user.avatar || aminaAvatar}
                                    alt={user.name}
                                />
                                <AvatarFallback className="bg-scholarly-blue text-white">
                                    AY
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid min-w-0 flex-1 text-left leading-tight">
                                <span className="truncate text-[13px] font-semibold text-white">
                                    {user.name || 'Amina Yusuf'}
                                </span>
                                <span className="truncate text-[11px] text-white/55">
                                    Student
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

export function AppSidebar() {
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
                            <Link href="/dashboard" prefetch>
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
                    {navItems.map((item) => (
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
                <SidebarProfile />
            </SidebarFooter>
        </Sidebar>
    );
}
