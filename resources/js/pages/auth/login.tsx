import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen items-center justify-center bg-scholarly-blue-white px-4 py-12 sm:px-6 lg:px-8">
                <PasskeyVerify />

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-scholarly-blue text-white shadow-lg">
                                <span className="text-xl">S</span>
                            </div>
                        </div>
                        <h2 className="mt-6 text-2xl font-bold tracking-tight text-scholarly-navy">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <div className="mt-8 space-y-1">
                        {status && (
                            <div className="mb-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-sm text-scholarly-blue hover:underline"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />
                                        <Label htmlFor="remember">
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full bg-scholarly-blue text-white shadow-lg hover:bg-scholarly-blue-dark focus-visible:ring-scholarly-blue"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Sign in{' '}
                                        <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </>
                            )}
                        </Form>

                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <TextLink
                                href={register.url()}
                                data-test="register-link"
                                tabIndex={6}
                                className="font-medium text-scholarly-blue hover:underline"
                            >
                                Sign up
                            </TextLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
