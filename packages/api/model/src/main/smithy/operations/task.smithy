$version: "2"

namespace com.aws

use com.aws#BadRequestError
use com.aws#InternalFailureError

@readonly
@http(method: "GET", uri: "/list/{listId}/task", code: 200)
@handler(language: "typescript")
operation GetAllTasks {
    input: GetAllTasksInput
    output: GetAllTasksOutput
}

@input
structure GetAllTasksInput for TaskResource {
    @required
    @httpLabel
    listId: String
}

structure GetAllTasksOutput {
    @required
    tasks: ListAllTasks
}

list ListAllTasks {
    member: Task
}

@http(method: "POST", uri: "/list/{listId}/task", code: 200)
@handler(language: "typescript")
operation AddTask {
    input: AddTaskInput
    output: Task
    errors: [InternalFailureError, BadRequestError]
}

@input
structure AddTaskInput for TaskResource {
    // Sent in the URI label named "listId".
    @required
    @httpLabel
    listId: String
    @required
    title: String
    description: String
}

structure Task with [CommonFields] {
    @required
    id: String
    @required
    title: String
    description: String
    @required
    createdById: String
    @required
    createdByName: String
    @required
    listId: String
}
