const adminAuth = (req, res, next) => {
    const token = "xyaadkls";
    const isAdminAuthorize = token === "xyz";
    if (isAdminAuthorize) {
        res.status(401).send("Unauthorized request")
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    const token = "xyaadkls";
    const isAdminAuthorize = token === "xyz";
    if (!isAdminAuthorize) {
        res.status(401).send("Unauthorized request")
    } else {
        next();
    }
}
module.exports = {
    adminAuth,
    userAuth,
}