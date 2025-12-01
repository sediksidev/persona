"use client";

import { useState } from "react";
import { cards, typography, spacing, buttons } from "@/styles/design-system";

export default function IncrementExample() {
    const [isExecuting, setIsExecuting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const executeAction = async () => {
        setIsExecuting(true);
        setResult(null);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const success = Math.random() > 0.3;
        setResult({
            success,
            message: success ? "Action successful!" : "Action failed. Persona criteria not met.",
        });
        setIsExecuting(false);
    };

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

            <button
                onClick={executeAction}
                disabled={isExecuting}
                className={`${buttons.primary} ${buttons.fullWidth}`}
            >
                {isExecuting ? "Executing..." : "Execute action"}
            </button>

            {result && (
                <div className={`${spacing.mt.md} ${result.success ? cards.success : cards.error}`}>
                    <p className={`${typography.bodyBold} ${spacing.mb.xs}`}>{result.success ? "✓ Success" : "✗ Failed"}</p>
                    <p className={`${typography.body} opacity-90`}>{result.message}</p>
                </div>
            )}
        </div>
    );
}
