import { Head, useForm, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit, update } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    const form = useForm({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null as File | null,
    });

    const onSubmit = () => {
        form.transform((data) => ({
            ...data,
            avatar: data.avatar ?? undefined,
        }));
        form.put(update.url(), {
            onSuccess: () => {
                form.reset();
                form.setData('name', auth.user.name);
                form.setData('email', auth.user.email);
            },
        });
    };

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="max-w-2xl mx-auto space-y-8">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Manage your account details and profile picture"
                />

                <Card className="space-y-6">
                    <CardHeader>
                        <CardTitle>Profile picture</CardTitle>
                        <CardDescription>
                            Upload a profile picture to personalize your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }} className="space-y-6">
                                        <div className="grid items-center gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="relative group">
                                            {(auth.user.avatar_url as string | null) ? (
                                                <AvatarImage
                                                    src={auth.user.avatar_url as string}
                                                    className="size-32 rounded-full object-cover border-2 border-border"
                                                />
                                            ) : (
                                                <Avatar
                                                    className="size-32 rounded-full border-2 border-border bg-muted"
                                                >
                                                    <AvatarFallback className="text-xl">
                                                        {auth.user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="avatar"
                                                className="sr-only"
                                                onChange={(event) => {
                                                    const file =
                                                        event.target.files?.[0] ??
                                                        null;
                                                    form.setData('avatar', file);
                                                }}
                                            />

                                            <label className="flex items-center justify-center w-full cursor-pointer">
                                                <Button variant="outline" size="sm">
                                                    Change photo
                                                </Button>
                                            </label>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            JPG, PNG or WebP up to 2 MB
                                        </p>
                                    </div>

                                    <div className="col-span-1 sm:col-span-2 flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Full name</Label>
                                                <Input
                                                    id="name"
                                                    className="mt-1 block w-full"
                                                    value={form.data.name}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    name="name"
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Jane Doe"
                                                />
                                                <InputError
                                                    className="mt-2"
                                                    message={
                                                        form.errors.name as
                                                            | string
                                                            | undefined
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Email address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className="mt-1 block w-full"
                                                    value={form.data.email}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    name="email"
                                                    required
                                                    autoComplete="username"
                                                    placeholder="email@example.com"
                                                />
                                                <InputError
                                                    className="mt-2"
                                                    message={
                                                        form.errors.email as
                                                            | string
                                                            | undefined
                                                    }
                                                />
                                            </div>

                                            {mustVerifyEmail &&
                                                auth.user.email_verified_at ===
                                                    null && (
                                                    <div>
                                                        <p className="-mt-4 text-sm text-muted-foreground">
                                                            Your email address is unverified.{' '}
                                                            <Link
                                                                href={send()}
                                                                as="button"
                                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                            >
                                                                Click here to re-send the verification email.
                                                            </Link>
                                                        </p>

                                                        {status ===
                                                            'verification-link-sent' && (
                                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                                A new verification link has been sent to your email address.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                            <div className="flex items-center gap-4">
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        form.processing ||
                                                        !form.isDirty
                                                    }
                                                    data-test="update-profile-button"
                                                    className="bg-scholarly-blue text-white shadow-lg hover:bg-scholarly-blue-dark focus-visible:ring-scholarly-blue"
                                                >
                                                    Save changes
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                    </CardContent>
                </Card>

                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
