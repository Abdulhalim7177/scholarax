import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verify your email" />

            <div className="min-h-screen flex items-center justify-center bg-scholarly-blue-white px-4 py-12">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-scholarly-blue text-white shadow-lg">
                            <span className="text-xl">✓</span>
                        </div>
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-scholarly-navy tracking-tight">
                        Verify your email
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                        Please check your inbox and click the verification link
                        we just sent to activate your account.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mt-4 text-sm font-medium text-green-600">
                            A new verification link has been sent to your email
                            address.
                        </div>
                    )}

                    <div className="space-y-4">
                        <Form {...send.form()} className="space-y-2">
                            {({ processing }) => (
                                <Button
                                    disabled={processing}
                                    variant="outline"
                                    className="w-full bg-scholarly-blue text-white hover:bg-scholarly-blue-dark"
                                >
                                    {processing && <Spinner />}
                                    Resend verification email <ArrowRight className="ml-2 size-4" />
                                </Button>
                            )}
                        </Form>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm text-scholarly-blue hover:underline"
                        >
                            Log out
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify your email',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};
