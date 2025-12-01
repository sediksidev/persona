import Link from "next/link";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout currentPage="home" maxWidth="4xl">
      <main className="py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            Powered by Zama fhEVM
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Identity protocol for<br />
            privacy-first dApps
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Build apps that verify user attributes without exposing sensitive data. Integrate encrypted identity verification in minutes.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Try demo
            </Link>
            <Link
              href="/use-cases"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View examples
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md">
            <div className="mb-3 text-3xl">🔐</div>
            <h3 className="mb-1 font-semibold text-gray-900">FHE-based</h3>
            <p className="text-sm text-gray-600">Fully Homomorphic Encryption stores data on-chain encrypted.</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md">
            <div className="mb-3 text-3xl">✓</div>
            <h3 className="mb-1 font-semibold text-gray-900">Composable</h3>
            <p className="text-sm text-gray-600">Simple API for age, gender, and custom attribute verification.</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md">
            <div className="mb-3 text-3xl">⚡</div>
            <h3 className="mb-1 font-semibold text-gray-900">Zero-knowledge</h3>
            <p className="text-sm text-gray-600">Verify conditions without revealing underlying user data.</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="rounded-lg bg-gray-50 p-8">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">For developers</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">1</div>
              <h3 className="mb-1 font-semibold text-gray-900">Users register</h3>
              <p className="text-sm text-gray-600">Users encrypt their data client-side via your dApp</p>
            </div>
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">2</div>
              <h3 className="mb-1 font-semibold text-gray-900">You integrate</h3>
              <p className="text-sm text-gray-600">Call Persona from your smart contracts for verification</p>
            </div>
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">3</div>
              <h3 className="mb-1 font-semibold text-gray-900">Build features</h3>
              <p className="text-sm text-gray-600">Age-gating, access control, conditional logic—all private</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
