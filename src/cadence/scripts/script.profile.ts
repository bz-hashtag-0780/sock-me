export const PROFILE = `
import Profile from 0x097bafa4e0b48eef

pub fun main(address: Address) :  Profile.UserProfile? {
	return getAccount(address)
		.getCapability<&{Profile.Public}>(Profile.publicPath)
		.borrow()?.asProfile()
}
`