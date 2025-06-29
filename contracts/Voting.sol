// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    enum Status { Pending, Approved, Rejected }

    struct Candidate {
        string name;
        string slogan;
        uint voteCount;
        string photoUrl;
        string docUrl;
        Status status;
    }

    struct Voter {
        string name;
        address wallet;
        string docUrl;
        bool hasVoted;
        address votedCandidate;
        Status status;
    }

    mapping(address => bool) public admins;
    mapping(address => Voter) public voters;
    mapping(address => Candidate) public candidates;
    address[] public candidateAddresses;

    uint public startTime;
    uint public endTime;

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    modifier onlyDuringVoting() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Voting is not active");
        _;
    }

    constructor(uint _startTime, uint _endTime) {
        require(msg.sender != address(0), "Invalid admin address");
        require(_startTime < _endTime, "Invalid time range");

        admin = msg.sender;
        admins[msg.sender] = true;
        startTime = _startTime;
        endTime = _endTime;
    }

    // --- Events ---
    event AdminAdded(address indexed newAdmin);
    event CandidateRegistered(address indexed candidate, string name);
    event CandidateStatusChanged(address indexed candidate, Status newStatus);
    event VoterRegistered(address indexed voter, string name);
    event VoterStatusChanged(address indexed voter, Status newStatus);
    event Voted(address indexed voter, address indexed candidate);

    // --- Admin Management ---
    function isAdmin(address _addr) external view returns (bool) {
        return admins[_addr];
    }

    function addAdmin(address _newAdmin) external onlyAdmin {
        admins[_newAdmin] = true;
        emit AdminAdded(_newAdmin);
    }

    // --- Voting Period ---
    function setVotingPeriod(uint _startTime, uint _endTime) external onlyAdmin {
        require(_startTime < _endTime, "Invalid time range");
        startTime = _startTime;
        endTime = _endTime;
    }

    // --- Voter Registration ---
    function registerVoter(
        address _wallet,
        string memory _name,
        string memory _docUrl
    ) external onlyAdmin {
        require(voters[_wallet].wallet == address(0), "Already registered");

        voters[_wallet] = Voter({
            name: _name,
            wallet: _wallet,
            docUrl: _docUrl,
            hasVoted: false,
            votedCandidate: address(0),
            status: Status.Pending
        });

        emit VoterRegistered(_wallet, _name);
    }

    // --- Candidate Registration ---
    function registerCandidate(
        address _candidateAddr,
        string memory _name,
        string memory _slogan,
        string memory _photoUrl,
        string memory _docUrl
    ) external onlyAdmin {
        require(bytes(candidates[_candidateAddr].name).length == 0, "Candidate already registered");

        candidates[_candidateAddr] = Candidate({
            name: _name,
            slogan: _slogan,
            voteCount: 0,
            photoUrl: _photoUrl,
            docUrl: _docUrl,
            status: Status.Pending
        });

        candidateAddresses.push(_candidateAddr);
        emit CandidateRegistered(_candidateAddr, _name);
    }

    // --- Voting ---
    function vote(address _candidateAddr) external onlyDuringVoting {
        Voter storage sender = voters[msg.sender];
        require(sender.wallet != address(0), "Not a registered voter");
        require(sender.status == Status.Approved, "Voter not approved");
        require(!sender.hasVoted, "Already voted");
        require(candidates[_candidateAddr].status == Status.Approved, "Candidate not approved");

        sender.hasVoted = true;
        sender.votedCandidate = _candidateAddr;
        candidates[_candidateAddr].voteCount++;

        emit Voted(msg.sender, _candidateAddr);
    }

    // --- Status Management ---
    function changeCandidateStatus(address _candidateAddr, Status _newStatus) external onlyAdmin {
        require(bytes(candidates[_candidateAddr].name).length != 0, "Candidate not found");
        candidates[_candidateAddr].status = _newStatus;
        emit CandidateStatusChanged(_candidateAddr, _newStatus);
    }

    function changeVoterStatus(address _voterAddr, Status _newStatus) external onlyAdmin {
        require(voters[_voterAddr].wallet != address(0), "Voter not found");
        voters[_voterAddr].status = _newStatus;
        emit VoterStatusChanged(_voterAddr, _newStatus);
    }

    // --- Views ---
    function getCandidateList() external view returns (address[] memory) {
        return candidateAddresses;
    }

    function getCandidateDetails(address _candidateAddr) external view returns (
        string memory, string memory, uint, string memory, string memory, Status
    ) {
        Candidate memory c = candidates[_candidateAddr];
        return (c.name, c.slogan, c.voteCount, c.photoUrl, c.docUrl, c.status);
    }

    function getVoterDetails(address _voterAddr) external view returns (
        string memory, address, string memory, bool, address, Status
    ) {
        Voter memory v = voters[_voterAddr];
        return (v.name, v.wallet, v.docUrl, v.hasVoted, v.votedCandidate, v.status);
    }
}
