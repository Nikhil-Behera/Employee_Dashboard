const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");

const applyForLeave = async (req, res, next) => {
  const { leaveDays, leaveStartDate, leaveEndDate, reason } = req.body.leaveDate || req.body;
  const uid = req.params.uid;

  try {
    await LeaveRequest.create({
      user_id: uid,
      start_date: leaveStartDate,
      end_date: leaveEndDate,
      reason: reason || ""
    });
    return res.status(200).json({ message: "Leave applied successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const leaveEmployee = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.findAll();
    const pendingLeaves = leaves.filter(leave => leave.status === 'Pending');
    
    const usersWithLeaves = {};
    for (const leave of pendingLeaves) {
      if (!usersWithLeaves[leave.user_id]) {
        const user = await User.findById(leave.user_id);
        usersWithLeaves[leave.user_id] = {
           id: user.id,
           name: user.name,
           image: user.image || "",
           leaveDate: []
        };
      }
      usersWithLeaves[leave.user_id].leaveDate.push({
         id: leave.id,
         startDate: leave.start_date,
         leaveDate: leave.end_date,
         leave_status: leave.status.toLowerCase(),
         reason: leave.reason
      });
    }

    res.status(200).send({ message: "Leaves Found", user: Object.values(usersWithLeaves), success: true });
  } catch (error) {
    res.status(500).json({ message: "Could not find any leave requests!", success: false });
  }
};

const approveLeave = async (req, res, next) => {
  const { applyForLeave } = req.body;
  const permission = applyForLeave ? "Approved" : "Rejected";
  const leave_id = req.params.leaveId;

  try {
    const success = await LeaveRequest.updateStatus(leave_id, permission);
    if (!success) {
      return res.status(404).json({ message: "Could not update the leave status!" });
    }
    return res.status(200).json({ message: `Leave ${permission} successfully`, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getLeaveData = async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const leaves = await LeaveRequest.findByUserId(uid);
    return res.status(200).json({ leaves, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  applyForLeave,
  leaveEmployee,
  approveLeave,
  getLeaveData,
};
