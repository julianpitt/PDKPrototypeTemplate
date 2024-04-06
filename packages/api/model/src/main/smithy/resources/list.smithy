$version: "2"

namespace com.aws

resource ListResource {
    identifiers: {
        id: String
    }
    list: GetAllLists
    create: AddList
}
