import SavingsCalculator from './components/SavingsCalculator';

export default function Home() {
  return (
    <main className="bg-black min-h-screen flex items-center justify-center p-4 text-white">
      <div className="max-w-xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6">See How Much You Can Save</h1>
        <SavingsCalculator />
      </div>
    </main>
  );
}
