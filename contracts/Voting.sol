// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    string[] public candidates;
    address[] public voters;

    mapping(string => uint) public votes;
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isVoter;

    event VoterRegistered(address voter);
    event CandidateAdded(string name);
    event Voted(address voter, string candidate);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(string[] memory _candidates) {
        admin = msg.sender;
        for (uint i = 0; i < _candidates.length; i++) {
            candidates.push(_candidates[i]);
        }
    }

    function addCandidate(string memory name) external onlyAdmin {
        candidates.push(name);
        emit CandidateAdded(name);
    }

    function registerVoter(address voter) external onlyAdmin {
        require(!isVoter[voter], "Already registered");
        isVoter[voter] = true;
        voters.push(voter);
        emit VoterRegistered(voter);
    }

    function vote(string memory candidate) external {
        require(isVoter[msg.sender], "Not authorized to vote");
        require(!hasVoted[msg.sender], "Already voted");

        bool valid = false;
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i])) == keccak256(bytes(candidate))) {
                valid = true;
                break;
            }
        }
        require(valid, "Invalid candidate");

        votes[candidate]++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, candidate);
    }

    function getCandidates() external view returns (string[] memory) {
        return candidates;
    }

    function getVoters() external view onlyAdmin returns (address[] memory) {
        return voters;
    }

    function getVotes(string memory candidate) external view returns (uint) {
        return votes[candidate];
    }
    function isVoterValid(address addr) public view returns (bool) {
        return isVoter[addr];
    }

}
