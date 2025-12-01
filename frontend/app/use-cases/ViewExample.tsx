"use client";

import { useView } from "@/hooks/useView";
import { cards, typography, spacing, buttons } from "@/styles/design-system";

export default function ViewExample() {
    const { viewContent, isViewing, viewResult, decryptViewCount, isDecrypting, decryptedCount } = useView();

    return (
        <div className={cards.base}>
            <h2 className={`${typography.h3} ${spacing.mb.md}`}>Gender-Gated Access</h2>

            <div className={`${spacing.mb.lg} ${spacing.spaceY.md}`}>
                <div className={`${cards.infoBlue} ${spacing.p.xs}`}>
                    <p className={typography.smallBold}>Requirement</p>
                    <p className={typography.body}>Gender = Female</p>
                </div>

                <div className={`${cards.info} ${spacing.p.xs}`}>
                    <p className={typography.smallBold}>Description</p>
                    <p className={typography.body}>
                        Control content access by gender without storing gender data.
                    </p>
                </div>

                <div className={cards.codeContent}>
                    <p className={typography.smallBold} style={{ color: '#9ca3af' }}>Function call</p>
                    <code style={{ fontSize: '0.875rem', color: '#4ade80' }}>persona.isFemale(user)</code>
                </div>
            </div>

            <div className={spacing.spaceY.sm}>
                <button
                    onClick={viewContent}
                    disabled={isViewing}
                    className={`${buttons.primary} ${buttons.fullWidth}`}
                >
                    {isViewing ? "Submitting..." : "View Content (Female Only)"}
                </button>

                <button
                    onClick={decryptViewCount}
                    disabled={isDecrypting}
                    className={`${buttons.secondary} ${buttons.fullWidth}`}
                >
                    {isDecrypting ? "Decrypting..." : "Check My View Count"}
                </button>
            </div>

            {/* View Count Display */}
            {decryptedCount !== null && (
                <div className={`${spacing.mt.md} ${cards.infoBlue}`}>
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>Your View Count</p>
                    <p className={`${typography.h2} opacity-90`}>{decryptedCount}</p>
                    <p className={`${typography.small} opacity-75 ${spacing.mt.xs}`}>
                        {decryptedCount === "0"
                            ? "You haven't viewed yet, or you're not female"
                            : "Number of successful views (female only)"}
                    </p>
                </div>
            )}

            {/* Result */}
            {viewResult && (
                <div className={`${spacing.mt.md} ${viewResult.success ? cards.success : cards.error}`}>
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>{viewResult.success ? "✓ Success" : "✗ Failed"}</p>
                    <p className={`${typography.body} opacity-90`}>{viewResult.message}</p>
                </div>
            )}
        </div>
    );
}
