// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public superAdmin;

    constructor(address _superAdmin) {
        require(_superAdmin != address(0), "Invalid super admin");
        superAdmin = _superAdmin;
    }

    // -----------------------
    // Structs and State
    // -----------------------

    struct Institute {
        string name;
        address wallet;
        bool active;
    }

    struct Candidate {
        string name;
        string slogan;
        address institute;
    }

    struct Voter {
        address wallet;
        address institute;
        bool hasVoted;
        bool isRegistered;
    }

    Institute[] public institutes;
    Candidate[] public candidates;
    Voter[] public voters;

    mapping(address => bool) public isInstitute;
    mapping(address => bool) public hasVoted;
    mapping(string => uint) public votes;

    // -----------------------
    // Modifiers
    // -----------------------

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Only super admin");
        _;
    }

    modifier onlyAdmin() {
        require(isInstitute[msg.sender], "Only institute admin");
        _;
    }

    // -----------------------
    // Events
    // -----------------------

    event InstituteAdded(address wallet, string name);
    event InstituteRemoved(address wallet);
    event CandidateAdded(string name, string slogan);
    event VoterRegistered(address voter);
    event Voted(address voter, string candidate);

    // -----------------------
    // Super Admin Functions
    // -----------------------

    function addInstitute(string memory name, address wallet) external onlySuperAdmin {
        require(!isInstitute[wallet], "Already added");
        isInstitute[wallet] = true;
        institutes.push(Institute(name, wallet, true));
        emit InstituteAdded(wallet, name);
    }

    function removeInstitute(address wallet) external onlySuperAdmin {
        require(isInstitute[wallet], "Not an institute");
        isInstitute[wallet] = false;

        for (uint i = 0; i < institutes.length; i++) {
            if (institutes[i].wallet == wallet) {
                institutes[i].active = false;
                break;
            }
        }

        emit InstituteRemoved(wallet);
    }

    // -----------------------
    // Institute (Admin) Functions
    // -----------------------

    function addCandidate(string memory name, string memory slogan) external onlyAdmin {
        candidates.push(Candidate(name, slogan, msg.sender));
        emit CandidateAdded(name, slogan);
    }

    function registerVoter(address voterAddr) external onlyAdmin {
        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].wallet == voterAddr) revert("Already registered");
        }

        voters.push(Voter(voterAddr, msg.sender, false, true));
        emit VoterRegistered(voterAddr);
    }

    function updateCandidate(uint index, string memory newName, string memory newSlogan) external onlyAdmin {
        require(index < candidates.length, "Invalid index");
        require(candidates[index].institute == msg.sender, "Unauthorized");

        candidates[index].name = newName;
        candidates[index].slogan = newSlogan;
    }

    function deleteCandidate(uint index) external onlyAdmin {
        require(index < candidates.length, "Invalid index");
        require(candidates[index].institute == msg.sender, "Unauthorized");

        candidates[index] = candidates[candidates.length - 1];
        candidates.pop();
    }

    function updateVoter(uint index, address newAddr) external onlyAdmin {
        require(index < voters.length, "Invalid index");
        Voter storage v = voters[index];
        require(v.institute == msg.sender, "Unauthorized");
        require(!v.isRegistered || v.wallet != newAddr, "Already registered");

        v.wallet = newAddr;
    }

    function deleteVoter(uint index) external onlyAdmin {
        require(index < voters.length, "Invalid index");
        Voter storage v = voters[index];
        require(v.institute == msg.sender, "Unauthorized");

        voters[index] = voters[voters.length - 1];
        voters.pop();
    }

    // -----------------------
    // Voting
    // -----------------------

    function vote(string memory candidateName) external {
        bool validVoter = false;
        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].wallet == msg.sender && voters[i].isRegistered && !voters[i].hasVoted) {
                voters[i].hasVoted = true;
                validVoter = true;
                break;
            }
        }
        require(validVoter, "Not eligible or already voted");

        bool validCandidate = false;
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i].name)) == keccak256(bytes(candidateName))) {
                validCandidate = true;
                break;
            }
        }

        require(validCandidate, "Invalid candidate");
        votes[candidateName]++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, candidateName);
    }

    // -----------------------
    // Public View Functions
    // -----------------------

    function getInstituteCount() external view returns (uint) {
        return institutes.length;
    }

    function getInstitutes() external view returns (Institute[] memory) {
        return institutes;
    }

    function getCandidateCount() external view returns (uint) {
        return candidates.length;
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoterCount() external view returns (uint) {
        return voters.length;
    }

    function getVoters() external view returns (Voter[] memory) {
        return voters;
    }

    function getVotes(string memory candidate) external view returns (uint) {
        return votes[candidate];
    }

    function isSuperAdmin(address user) external view returns (bool) {
        return user == superAdmin;
    }

    function isInstituteActive(address inst) external view returns (bool) {
        return isInstitute[inst];
    }
}
