$version: "2"

namespace com.aws

use com.aws#BadRequestError
use com.aws#InternalFailureError

@readonly
@http(method: "GET", uri: "/list", code: 200)
@handler(language: "typescript")
operation GetAllLists {
    output: GetAllListsOutput
}

structure GetAllListsOutput {
    @required
    lists: ListAllLists
}

list ListAllLists {
    member: List
}

@http(method: "POST", uri: "/list", code: 200)
@handler(language: "typescript")
operation AddList {
    input: AddListInput
    output: List
    errors: [InternalFailureError, BadRequestError]
}

@input
structure AddListInput for ListResource {
    @required
    title: String
}

structure List with [CommonFields] {
    @required
    id: String
    @required
    title: String
    @required
    tasks: Integer
    @required
    createdById: String
    @required
    createdByName: String
}
