"use client";

import React from "react";
import { useUIStore } from "@/store";
import { CandleCustomizerModal } from "./CandleCustomizerModal";
import { FragranceQuizModal } from "./FragranceQuizModal";
import { BundleBuilderModal } from "./BundleBuilderModal";
import { CorporateOrdersModal } from "./CorporateOrdersModal";
import { LoyaltyReferralModal } from "./LoyaltyReferralModal";
import { AIChatConcierge } from "./AIChatConcierge";
import { VoiceImageSearch } from "./VoiceImageSearch";
import { POSBillingModal } from "./POSBillingModal";

export function GlobalModals() {
  const {
    isCustomizerOpen,
    closeCustomizer,
    isFragranceQuizOpen,
    closeFragranceQuiz,
    isBundleBuilderOpen,
    closeBundleBuilder,
    isCorporateOrdersOpen,
    closeCorporateOrders,
    isLoyaltyOpen,
    closeLoyalty,
    isAIChatOpen,
    closeAIChat,
    isVoiceSearchOpen,
    closeVoiceSearch,
    isPOSBillingOpen,
    closePOSBilling,
  } = useUIStore();

  return (
    <>
      <CandleCustomizerModal isOpen={isCustomizerOpen} onClose={closeCustomizer} />
      <FragranceQuizModal isOpen={isFragranceQuizOpen} onClose={closeFragranceQuiz} />
      <BundleBuilderModal isOpen={isBundleBuilderOpen} onClose={closeBundleBuilder} />
      <CorporateOrdersModal isOpen={isCorporateOrdersOpen} onClose={closeCorporateOrders} />
      <LoyaltyReferralModal isOpen={isLoyaltyOpen} onClose={closeLoyalty} />
      <AIChatConcierge isOpen={isAIChatOpen} onClose={closeAIChat} />
      <VoiceImageSearch isOpen={isVoiceSearchOpen} onClose={closeVoiceSearch} />
      <POSBillingModal isOpen={isPOSBillingOpen} onClose={closePOSBilling} />
    </>
  );
}
