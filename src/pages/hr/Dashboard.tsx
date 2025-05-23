import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

import HRLayout from '../../components/layout/HRLayout';

const HRDashboard: React.FC = () => {
  const [data, setData] = useState({
    total: 0,
    pendingSurveys: 0,
    completedSurveys: 0,
    byRisk: [],
    byDepartment: [],
    topRiskFactors: [],
    highRiskEmployees: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/analytics/turnover/')
      .then(res => {
        setData(prev => ({ ...prev, ...res.data }));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const pieData = {
    labels: data.byRisk?.map(r => r.name) || [],
    datasets: [{
      data: data.byRisk?.map(r => r.value) || [],
      backgroundColor: data.byRisk?.map(r => r.color) || [],
    }],
  };

  const barDeptData = {
    labels: data.byDepartment?.map(d => d.name) || [],
    datasets: [{
      label: 'Employees',
      data: data.byDepartment?.map(d => d.count) || [],
      backgroundColor: '#3B82F6',
    }],
  };

  const topFactorsData = {
    labels: data.topRiskFactors?.map(f => f.factor) || [],
    datasets: [{
      label: 'Average Score',
      data: data.topRiskFactors?.map(f => f.avgScore) || [],
      backgroundColor: '#F59E0B',
    }],
  };

  return (
    <HRLayout title="">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Pending: {data.pendingSurveys}</div>
            <div>Completed: {data.completedSurveys}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={pieData} />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barDeptData} />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Top Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={topFactorsData} />
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>High Risk Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {data.highRiskEmployees?.map((emp, idx) => (
                <li key={idx}>{emp.name} ({emp.department})</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </HRLayout>
  );
};

export default HRDashboard;
