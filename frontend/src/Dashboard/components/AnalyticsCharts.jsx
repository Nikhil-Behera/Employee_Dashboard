import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsCharts = ({ employeeData, attendanceData }) => {
  // Headcount per department logic
  const departmentCounts = {};
  employeeData.forEach(emp => {
    const dept = emp.department_name || 'Unassigned';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        label: '# of Employees',
        data: Object.values(departmentCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Attendance logic
  const presentCount = attendanceData?.filter(a => a.status === 'Present').length || 0;
  const absentCount = attendanceData?.filter(a => a.status === 'Absent').length || 0;
  const leaveCount = attendanceData?.filter(a => a.status === 'Leave').length || 0;

  const barData = {
    labels: ['Present', 'Absent', 'On Leave'],
    datasets: [
      {
        label: 'Attendance Trends',
        data: [presentCount, absentCount, leaveCount],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
      },
    ],
  };

  return (
    <div className="row mt-4">
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title text-center">Headcount by Department</h5>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
              {employeeData.length > 0 ? (
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              ) : (
                <p>No department data</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title text-center">Attendance Overview</h5>
            <div style={{ height: '300px' }}>
              <Bar 
                data={barData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
