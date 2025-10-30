const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}><path d="M3 7h11v8H3z"/><path d="M14 7h3l4 4v4h-7V7z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
);
const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
);
const RotateIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>
);
const CardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 15h2m2 0h2"/></svg>
);

export function FeaturesBar() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Free Delivery */}
          <div className="flex items-start gap-4 text-slate-800">
            <TruckIcon className="w-10 h-10 text-slate-600" />
            <div>
              <div className="text-lg font-semibold">Free Delivery</div>
              <div className="text-slate-500">from $50</div>
            </div>
          </div>
          {/* Customer Feedback */}
          <div className="flex items-start gap-4 text-slate-800">
            <ChatIcon className="w-10 h-10 text-slate-600" />
            <div>
              <div className="text-lg font-semibold">99% Customer</div>
              <div className="text-slate-500">Feedbacks</div>
            </div>
          </div>
          {/* Returns */}
          <div className="flex items-start gap-4 text-slate-800">
            <RotateIcon className="w-10 h-10 text-slate-600" />
            <div>
              <div className="text-lg font-semibold">365 Days</div>
              <div className="text-slate-500">for free return</div>
            </div>
          </div>
          {/* Payment */}
          <div className="flex items-start gap-4 text-slate-800">
            <CardIcon className="w-10 h-10 text-slate-600" />
            <div>
              <div className="text-lg font-semibold">Payment</div>
              <div className="text-slate-500">Secure System</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

