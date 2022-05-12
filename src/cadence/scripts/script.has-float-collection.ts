export const HAS_FLOAT_COLLECTION = `
import NonFungibleToken from 0x1d7e57aa55817448
import FLOAT from 0x2d4c3caffbeab845

/*
pub fun hasFloatCollection(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&FLOAT.Collection{NonFungibleToken.CollectionPublic, FLOAT.CollectionPublic}>(FLOAT.FLOATCollectionPublicPath)
    .check()
}

pub fun main(address: Address): Bool {
  return hasFloatCollection(address)
}
*/

import RaribleNFT from 0x01ab36aaf654a13e

pub fun hasRaribleCollection(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&{NonFungibleToken.CollectionPublic}>(RaribleNFT.collectionPublicPath)
    .check()
}
pub fun main(address: Address): Int {
  let sockIds : [UInt64] = [14813, 15013, 14946, 14808, 14899, 14792, 15016, 14961, 14816, 14796, 14992, 14977, 14815, 14863, 14817, 14814, 14875, 14960, 14985, 14850, 14849, 14966, 14826, 14972, 14795, 15021, 14950, 14847, 14970, 14833, 14786, 15010, 14953, 14799, 14883, 14947, 14844, 14801, 14886, 15015, 15023, 15027, 15029, 14802, 14810, 14948, 14955, 14957, 14988, 15007, 15009, 14837, 15024, 14803, 14973, 14969, 15002, 15017, 14797, 14894, 14881, 15025, 14791, 14979, 14789, 14993, 14873, 14939, 15005, 15006, 14869, 14889, 15004, 15008, 15026, 14990, 14998, 14898, 14819, 14840, 14974, 15019, 14856, 14838, 14787, 14876, 14996, 14798, 14855, 14824, 14843, 14959, 15020, 14862, 14822, 14897, 14830, 14790, 14867, 14878, 14991, 14835, 14818, 14892, 14800, 15000, 14857, 14986, 14805, 14812, 14962]
  var count = 0
  if hasRaribleCollection(address) {
    let collection = getAccount(address).getCapability<&{NonFungibleToken.CollectionPublic}>(RaribleNFT.collectionPublicPath).borrow()!

        for id in collection.getIDs() {
            if !sockIds.contains(id) {
                continue
            }
      count = count + 1
        }
  }

  return count
}
`
