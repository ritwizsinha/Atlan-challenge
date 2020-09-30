const taskState = {
    RUNNING: 0,
    PAUSED: 1,
    ENDED: 2,
}
const action = {
    UPLOAD: "upload",
    EXPORT: "export"
}
module.exports = {
    taskState,
    action
}