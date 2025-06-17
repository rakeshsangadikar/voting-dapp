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

    function updateCandidate(string memory oldName, string memory newName) external onlyAdmin {
        require(bytes(oldName).length > 0 && bytes(newName).length > 0, "Names required");
        require(keccak256(bytes(oldName)) != keccak256(bytes(newName)), "Names must differ");

        bool found = false;
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i])) == keccak256(bytes(oldName))) {
                candidates[i] = newName;
                votes[newName] = votes[oldName];
                delete votes[oldName];
                found = true;
                break;
            }
        }
        require(found, "Old candidate not found");
    }

    function deleteCandidate(string memory name) external onlyAdmin {
        bool found = false;
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i])) == keccak256(bytes(name))) {
                candidates[i] = candidates[candidates.length - 1]; // Replace with last
                candidates.pop(); // Remove last
                delete votes[name]; // Delete their vote record
                found = true;
                break;
            }
        }
        require(found, "Candidate not found");
    }

    function updateVoter(address oldAddr, address newAddr) external onlyAdmin {
        require(isVoter[oldAddr], "Old voter not registered");
        require(!isVoter[newAddr], "New voter already registered");

        // Transfer voter status
        isVoter[newAddr] = true;
        hasVoted[newAddr] = hasVoted[oldAddr];
        isVoter[oldAddr] = false;
        hasVoted[oldAddr] = false;

        // Update voters array
        for (uint i = 0; i < voters.length; i++) {
            if (voters[i] == oldAddr) {
                voters[i] = newAddr;
                break;
            }
        }
    }

    function deleteVoter(address voter) external onlyAdmin {
        require(isVoter[voter], "Voter not found");

        isVoter[voter] = false;
        hasVoted[voter] = false;

        // Remove from voters array
        for (uint i = 0; i < voters.length; i++) {
            if (voters[i] == voter) {
                voters[i] = voters[voters.length - 1]; // Replace with last
                voters.pop(); // Remove last
                break;
            }
        }
    }

}
