import Link from "next/link";

function Navbar() {
  return (
    <div className="flex justify-around items-center w-full h-16">
      <Link href="/">CiteMind</Link>
      <div className="flex items-center md:gap-8 gap-2">
        <Link href="/citation">Citation Network</Link>
        <Link href="/trends">Trends</Link>
      </div>
    </div>
  );
}

export default Navbar;
