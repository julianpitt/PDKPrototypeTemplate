$version: "2"

namespace com.aws

use aws.protocols#restJson1

@mixin
structure CommonFields {
    @required
    createdAt: String
    @required
    updatedAt: String
    @required
    id: String
}

@restJson1
service TestApi {
    version: "1.0"
    resources: [ListResource, TaskResource]
    errors: [
        BadRequestError
        NotAuthorizedError
        InternalFailureError
    ]
}
