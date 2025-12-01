"use client";

import { useIncrement } from "@/hooks/useIncrement";
import { cards, typography, spacing, buttons } from "@/styles/design-system";

export default function IncrementExample() {
    const { increment, isIncrementing, incrementResult, decryptCounter, isDecrypting, decryptedCounter } = useIncrement();

    return (
        <div className={cards.base}>
            <h2 className={`${typography.h3} ${spacing.mb.md}`}>Conditional Counter</h2>

            <div className={`${spacing.mb.lg} ${spacing.spaceY.md}`}>
                <div className={`${cards.infoBlue} ${spacing.p.xs}`}>
                    <p className={typography.smallBold}>Requirement</p>
                    <p className={typography.body}>Age ≥ 18</p>
                </div>

                <div className={`${cards.info} ${spacing.p.xs}`}>
                    <p className={typography.smallBold}>Description</p>
                    <p className={typography.body}>
                        Increment state only if conditions are met. Useful for engagement tracking.
                    </p>
                </div>

                <div className={cards.codeContent}>
                    <p className={typography.smallBold} style={{ color: '#9ca3af' }}>Function call</p>
                    <code style={{ fontSize: '0.875rem', color: '#4ade80' }}>
                        FHE.select(persona.isAgeAtLeast(user, 18), newValue, oldValue)
                    </code>
                </div>
            </div>

            <div className={spacing.spaceY.sm}>
                <button
                    onClick={increment}
                    disabled={isIncrementing}
                    className={`${buttons.primary} ${buttons.fullWidth}`}
                >
                    {isIncrementing ? "Incrementing..." : "Increment Counter (Age ≥ 18)"}
                </button>

                <button
                    onClick={decryptCounter}
                    disabled={isDecrypting}
                    className={`${buttons.secondary} ${buttons.fullWidth}`}
                >
                    {isDecrypting ? "Decrypting..." : "Check My Counter"}
                </button>
            </div>

            {/* Counter Display */}
            {decryptedCounter !== null && (
                <div className={`${spacing.mt.md} ${cards.infoBlue}`}>
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>Your Counter</p>
                    <p className={`${typography.h2} opacity-90`}>{decryptedCounter}</p>
                    <p className={`${typography.small} opacity-75 ${spacing.mt.xs}`}>
                        {decryptedCounter === "0"
                            ? "You haven't incremented yet, or you're under 18 years old"
                            : "Number of successful increments (age ≥ 18)"}
                    </p>
                </div>
            )}

            {/* Result */}
            {incrementResult && (
                <div className={`${spacing.mt.md} ${incrementResult.success ? cards.success : cards.error}`}>
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>{incrementResult.success ? "✓ Success" : "✗ Failed"}</p>
                    <p className={`${typography.body} opacity-90`}>{incrementResult.message}</p>
                </div>
            )}
        </div>
    );
}
