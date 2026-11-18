import { AlertCircle, BadgeCheck, Clock3 } from 'lucide-react';

import type { MentorOwnProfileProps } from '@/types/domain';

type Props = Pick<MentorOwnProfileProps, 'verification'>;

export default function VerificationBanner({ verification }: Props) {
    if (verification.status === 'verified') {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-scholarly-teal/30 bg-scholarly-teal-soft px-5 py-4">
                <BadgeCheck className="size-5 shrink-0 text-scholarly-teal-dark" />
                <div>
                    <p className="text-sm font-bold text-scholarly-teal-dark">
                        {verification.label}
                    </p>
                    <p className="mt-0.5 text-xs text-scholarly-teal-dark/80">
                        Your profile is visible in the public mentor directory.
                    </p>
                </div>
            </div>
        );
    }

    const rejected = verification.status === 'rejected';

    return (
        <div
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${
                rejected
                    ? 'border-scholarly-coral-dark/30 bg-scholarly-coral-soft'
                    : 'border-scholarly-gold/40 bg-scholarly-gold-soft'
            }`}
        >
            {rejected ? (
                <AlertCircle className="size-5 shrink-0 text-scholarly-coral-dark" />
            ) : (
                <Clock3 className="size-5 shrink-0 text-scholarly-gold-dark" />
            )}
            <div>
                <p
                    className={`text-sm font-bold ${
                        rejected
                            ? 'text-scholarly-coral-dark'
                            : 'text-scholarly-gold-dark'
                    }`}
                >
                    {verification.label}
                </p>
                <p
                    className={`mt-0.5 text-xs ${
                        rejected
                            ? 'text-scholarly-coral-dark/80'
                            : 'text-scholarly-gold-dark/80'
                    }`}
                >
                    {rejected
                        ? 'Update your profile details and our team will review it again.'
                        : 'Complete your profile while our team reviews it. It becomes public once verified.'}
                </p>
            </div>
        </div>
    );
}
