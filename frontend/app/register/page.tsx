"use client";

import Layout from "@/components/Layout";
import RestrictedPage from "@/components/RestrictedPage";
import RegistrationForm from "@/components/RegistrationForm";

export default function RegisterPage() {
  return (
    <Layout currentPage="register" maxWidth="4xl">
      <RestrictedPage>
        <main className="py-12 min-h-[calc(100vh-8rem)]">
          <RegistrationForm />
        </main>
      </RestrictedPage>
    </Layout>
  );
}
