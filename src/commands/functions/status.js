
module.exports = (presenceStatus) => {
    return presenceStatus === "offline" ? ":black_circle: - Offline"
        :  presenceStatus === "online"  ? ":green_circle: - Online"
        :  presenceStatus === "idle"    ? ":yellow_circle: - Idle"
        :                                 ":red_circle: - Do Not Disturb"
}