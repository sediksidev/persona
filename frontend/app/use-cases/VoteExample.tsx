"use client";

import { useVote } from "@/hooks/useVote";
import { cards, typography, spacing, buttons } from "@/styles/design-system";

export default function VoteExample() {
    const { vote, isVoting, voteResult, decryptVoteCount, isDecrypting, decryptedCount } = useVote();

    return (
        <div className={cards.base}>
            <h2 className={`${typography.h3} ${spacing.mb.md}`}>Age-Gated Voting</h2>

            <div className={`${spacing.mb.lg} ${spacing.spaceY.md}`}>
                <div className={`${cards.infoBlue} ${spacing.p.xs}`}>
                    <p className={typography.smallBold}>Requirement</p>
                    <p className={typography.body}>Age &gt; 18</p>
                </div>

                <div className={`${cards.info} ${spacing.p.xs}`}>
                    <p className={typography.smallBold}>Description</p>
                    <p className={typography.body}>
                        Restrict voting to adults without collecting birthdates. Perfect for DAOs.
                    </p>
                </div>

                <div className={cards.codeContent}>
                    <p className={typography.smallBold} style={{ color: '#9ca3af' }}>Function call</p>
                    <code style={{ fontSize: '0.875rem', color: '#4ade80' }}>persona.isAgeAtLeast(user, 19)</code>
                </div>
            </div>

            <div className={spacing.spaceY.sm}>
                <button
                    onClick={vote}
                    disabled={isVoting}
                    className={`${buttons.primary} ${buttons.fullWidth}`}
                >
                    {isVoting ? "Submitting Vote..." : "Vote (Age > 18)"}
                </button>

                <button
                    onClick={decryptVoteCount}
                    disabled={isDecrypting}
                    className={`${buttons.secondary} ${buttons.fullWidth}`}
                >
                    {isDecrypting ? "Decrypting..." : "Check My Vote Count"}
                </button>
            </div>

            {/* Vote Count Display */}
            {decryptedCount !== null && (
                <div className={`${spacing.mt.md} ${cards.infoBlue}`}>
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>Your Vote Count</p>
                    <p className={`${typography.h2} opacity-90`}>{decryptedCount}</p>
                    <p className={`${typography.small} opacity-75 ${spacing.mt.xs}`}>
                        {decryptedCount === "0"
                            ? "You haven't voted yet, or you don't meet the age requirement (> 18)"
                            : "Number of successful votes (age > 18)"}
                    </p>
                </div>
            )}

            {/* Result */}
            {voteResult && (
                <div
                    className={`${spacing.mt.md} ${voteResult.success ? cards.success : cards.error}`}
                >
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>{voteResult.success ? "✓ Success" : "✗ Failed"}</p>
                    <p className={`${typography.body} opacity-90`}>{voteResult.message}</p>
                </div>
            )}
        </div>
    );
}
