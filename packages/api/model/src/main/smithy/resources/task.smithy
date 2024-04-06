$version: "2"

namespace com.aws

resource TaskResource {
    identifiers: {
        id: String
    }
    list: GetAllTasks
    create: AddTask
}
