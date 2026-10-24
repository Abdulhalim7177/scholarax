import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            <div className="min-h-screen flex items-center justify-center bg-scholarly-blue-white px-4 py-12">
                <div className="max-w-md w-full space-y-8">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="-ml-1"
                        >
                            <a href={login.url()} rel="noopener noreferrer">
                                <ArrowLeft className="size-5" />
                            </a>
                        </Button>
                    </div>

                    <div className="text-center">
                        <div className="flex justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-scholarly-blue text-white shadow-lg">
                                <span className="text-xl">🔑</span>
                            </div>
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-scholarly-navy tracking-tight">
                            Forgot password
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                            Enter your email and we'll send you a link to reset
                            your password.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <div className="space-y-6">
                        <Form {...email.form()}>
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="my-6 flex items-center justify-start">
                                        <Button
                                            className="w-full bg-scholarly-blue text-white shadow-lg hover:bg-scholarly-blue-dark focus-visible:ring-scholarly-blue"
                                            disabled={processing}
                                            data-test="email-password-reset-link-button"
                                        >
                                            Email password reset link
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        <div className="space-x-1 text-center text-sm text-muted-foreground">
                            <span>Remember your password?</span>{' '}
                            <TextLink
                                href={login.url()}
                                className="font-medium text-scholarly-blue hover:underline"
                            >
                                Log in
                            </TextLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
