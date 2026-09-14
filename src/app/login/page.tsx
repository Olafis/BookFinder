import { Suspense } from "react";
import type { Metadata } from "next";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export const metadata: Metadata = {
  title: "로그인",
  description: "구글 계정 한 번이면 서재에 책을 저장할 수 있습니다.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        선택 계정
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">구글로 바로 시작</h1>
      <p className="mt-3 text-sm leading-6 text-ink-muted">
        가입과 로그인이 같은 버튼입니다. 처음이든 다시 오든, 구글만 통과하면
        바로 로그인됩니다. 검색은 계정 없이 됩니다.
      </p>
      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          구글 로그인이 끝나지 않았습니다. 한 번만 다시 눌러 주세요.
        </p>
      ) : null}
      <div className="mt-8">
        <Suspense>
          <GoogleSignInButton />
        </Suspense>
      </div>
    </div>
  );
}
