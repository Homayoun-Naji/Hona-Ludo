import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">منچ هُنا</h1>
      <p className="text-muted-foreground">بازی لودو ۵ نفره روی تلگرام</p>
      <div className="flex gap-4">
        <Link href="/room" className="text-sm font-medium underline">
          اتاق بازی
        </Link>
        <Link href="/game" className="text-sm font-medium underline">
          صفحه بازی
        </Link>
      </div>
    </div>
  );
}
