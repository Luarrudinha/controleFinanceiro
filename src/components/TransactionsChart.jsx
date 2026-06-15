import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './TransactionsChart.css';

const TransactionsChart = ({ transactions }) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const data = [
    { name: 'Renda', value: income, color: '#4ade80' },
    { name: 'Despesa', value: expense, color: '#f87171' },
  ];

  if (income === 0 && expense === 0) {
    return (
      <div className="chart-card glass-panel flex-center">
        <p className="text-muted">No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="chart-card glass-panel">
      <h3 className="card-title">Fluxo de caixa</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2028', border: '1px solid #2e303a', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#4ade80' }}></span>
          <span>Renda</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#f87171' }}></span>
          <span>Expense</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionsChart;
