import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset password" />

            <div className="min-h-screen flex items-center justify-center bg-scholarly-blue-white px-4 py-12">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-scholarly-blue text-white shadow-lg">
                                <span className="text-xl">🔑</span>
                            </div>
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-scholarly-navy tracking-tight">
                            Reset password
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                            Enter your new password below to regain access to
                            your account.
                        </p>
                    </div>

                    <Form
                        {...update.form()}
                        transform={(data) => ({ ...data, token, email })}
                        resetOnSuccess={['password', 'password_confirmation']}
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        className="mt-1 block w-full bg-muted/50"
                                        readOnly
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">New password</Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        autoComplete="new-password"
                                        className="mt-1 block w-full"
                                        autoFocus
                                        placeholder="••••••••"
                                        passwordrules={passwordRules}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm password
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        className="mt-1 block w-full"
                                        placeholder="••••••••"
                                        passwordrules={passwordRules}
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 w-full bg-scholarly-blue text-white shadow-lg hover:bg-scholarly-blue-dark focus-visible:ring-scholarly-blue"
                                    disabled={processing}
                                    data-test="reset-password-button"
                                >
                                    {processing && <Spinner />}
                                    Reset password <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};
