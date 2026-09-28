import API from "./api";

// =======================
// Get Ballot
// =======================
export const getBallot = () => {
    return API.get("/vote/ballot");
};

// =======================
// Submit Vote
// =======================
export const castVote = (data) => {
    return API.post("/vote", data);
};

// =======================
// Voting Status
// =======================
export const getVotingStatus = () => {
    return API.get("/vote/status");
};

// =======================
// My Votes
// =======================
export const getMyVotes = () => {
    return API.get("/vote/my-votes");
};