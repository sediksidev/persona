"use client";

import { useClaim } from "@/hooks/useClaim";
import { cards, typography, spacing, buttons } from "@/styles/design-system";

export default function ClaimExample() {
    const { claimReward, isClaiming, claimResult, decryptClaimCount, isDecrypting, decryptedCount } = useClaim();

    return (
        <div className={cards.base}>
            <h2 className={`${typography.h3} ${spacing.mb.md}`}>Multi-Condition Airdrop</h2>

            <div className={`${spacing.mb.lg} ${spacing.spaceY.md}`}>
                <div className={`${cards.infoBlue} ${spacing.p.xs}`}>
                    <p className={typography.smallBold}>Requirement</p>
                    <p className={typography.body}>Male AND Age &lt; 30</p>
                </div>

                <div className={`${cards.info} ${spacing.p.xs}`}>
                    <p className={typography.smallBold}>Description</p>
                    <p className={typography.body}>
                        Complex eligibility criteria using AND/OR logic on encrypted attributes.
                    </p>
                </div>

                <div className={cards.codeContent}>
                    <p className={typography.smallBold} style={{ color: '#9ca3af' }}>Function call</p>
                    <code style={{ fontSize: '0.875rem', color: '#4ade80' }}>
                        FHE.and(persona.isMale(user), persona.isAgeBetween(user, 0, 29))
                    </code>
                </div>
            </div>

            <div className={spacing.spaceY.sm}>
                <button
                    onClick={claimReward}
                    disabled={isClaiming}
                    className={`${buttons.primary} ${buttons.fullWidth}`}
                >
                    {isClaiming ? "Claiming..." : "Claim Reward (Male & Age < 30)"}
                </button>

                <button
                    onClick={decryptClaimCount}
                    disabled={isDecrypting}
                    className={`${buttons.secondary} ${buttons.fullWidth}`}
                >
                    {isDecrypting ? "Decrypting..." : "Check My Claim Count"}
                </button>
            </div>

            {/* Claim Count Display */}
            {decryptedCount !== null && (
                <div className={`${spacing.mt.md} ${cards.infoBlue}`}>
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>Your Claim Count</p>
                    <p className={`${typography.h2} opacity-90`}>{decryptedCount}</p>
                    <p className={`${typography.small} opacity-75 ${spacing.mt.xs}`}>
                        {decryptedCount === "0"
                            ? "You haven't claimed yet, or you don't meet the requirements (male & age < 30)"
                            : "Number of successful claims (male & age < 30)"}
                    </p>
                </div>
            )}

            {/* Result */}
            {claimResult && (
                <div className={`${spacing.mt.md} ${claimResult.success ? cards.success : cards.error}`}>
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>{claimResult.success ? "✓ Success" : "✗ Failed"}</p>
                    <p className={`${typography.body} opacity-90`}>{claimResult.message}</p>
                </div>
            )}
        </div>
    );
}
