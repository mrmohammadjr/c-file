import Logo from "@/app/assets/Logo.png"
import Image from 'next/image'
const Header = () => {
  return (
    <div className="p-5 flex items-center justify-between">
      <Image className="w-20" src={Logo} alt={""} />
    </div>
  )
}

export default Header
