
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/design-system";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Save, X, Download } from 'lucide-react';
import { VelocityData } from '../containers/TeamConfigurator';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface VelocityDataTableProps {
  velocityData: VelocityData[];
  isEditing: boolean;
  onDataChange: (updatedData: VelocityData[]) => void;
}

const VelocityDataTable: React.FC<VelocityDataTableProps> = ({
  velocityData,
  isEditing,
  onDataChange
}) => {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<VelocityData | null>(null);
  const [newRow, setNewRow] = useState<boolean>(false);

  const handleEditRow = (row: VelocityData) => {
    setEditingRow(row.sprintId);
    setEditRowData({...row});
  };

  const handleAddRow = () => {
    const newSprintId = uuidv4();
    const lastSprintNumber = Math.max(...velocityData.map(d => {
      const match = d.sprintName.match(/Sprint (\d+)/);
      return match ? parseInt(match[1]) : 0;
    }));
    
    const newSprintData: VelocityData = {
      sprintId: newSprintId,
      sprintName: `Sprint ${lastSprintNumber + 1}`,
      plannedPoints: 0,
      completedPoints: 0,
      completionRate: 0,
      date: new Date().toISOString().split('T')[0]
    };
    
    setEditingRow(newSprintId);
    setEditRowData(newSprintData);
    setNewRow(true);
  };

  const handleDeleteRow = (sprintId: string) => {
    onDataChange(velocityData.filter(row => row.sprintId !== sprintId));
    toast.success("Sprint data removed");
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditRowData(null);
    setNewRow(false);
  };

  const handleSaveRow = () => {
    if (editRowData) {
      // Calculate completion rate automatically
      const completionRate = editRowData.plannedPoints > 0 
        ? Math.round((editRowData.completedPoints / editRowData.plannedPoints) * 100) 
        : 0;
      
      const updatedRow = {
        ...editRowData,
        completionRate
      };

      if (newRow) {
        onDataChange([...velocityData, updatedRow]);
        toast.success("New sprint data added");
      } else {
        onDataChange(velocityData.map(row => 
          row.sprintId === editRowData.sprintId ? updatedRow : row
        ));
        toast.success("Sprint data updated");
      }
      
      setEditingRow(null);
      setEditRowData(null);
      setNewRow(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editRowData) {
      const { name, value } = e.target;
      setEditRowData({
        ...editRowData,
        [name]: name === 'sprintName' ? value : Number(value)
      });
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Sprint', 'Planned Points', 'Completed Points', 'Completion Rate', 'Date'].join(','),
      ...velocityData.map(row => [
        row.sprintName,
        row.plannedPoints,
        row.completedPoints,
        `${row.completionRate}%`,
        row.date
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'velocity_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Velocity data exported successfully");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Sprint Velocity History</h3>
        <div className="flex gap-2">
          {isEditing && (
            <Button 
              variant="outline" 
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={handleAddRow}
            >
              Add Sprint
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={16} />}
            onClick={handleExportData}
          >
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sprint</TableHead>
              <TableHead>Planned Points</TableHead>
              <TableHead>Completed Points</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Date</TableHead>
              {isEditing && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {velocityData.map((row) => (
              <TableRow key={row.sprintId}>
                {editingRow === row.sprintId ? (
                  // Editing mode
                  <>
                    <TableCell>
                      <Input
                        name="sprintName"
                        value={editRowData?.sprintName || ''}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="plannedPoints"
                        type="number"
                        value={editRowData?.plannedPoints || 0}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="completedPoints"
                        type="number"
                        value={editRowData?.completedPoints || 0}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      {editRowData?.plannedPoints ? 
                        Math.round((editRowData.completedPoints / editRowData.plannedPoints) * 100) : 0}%
                    </TableCell>
                    <TableCell>
                      <Input
                        name="date"
                        type="date"
                        value={editRowData?.date || ''}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          leftIcon={<Save size={14} />}
                          onClick={handleSaveRow}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          leftIcon={<X size={14} />}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </>
                ) : (
                  // View mode
                  <>
                    <TableCell>{row.sprintName}</TableCell>
                    <TableCell>{row.plannedPoints}</TableCell>
                    <TableCell>{row.completedPoints}</TableCell>
                    <TableCell>{row.completionRate}%</TableCell>
                    <TableCell>{row.date}</TableCell>
                    {isEditing && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            leftIcon={<Edit size={14} />}
                            onClick={() => handleEditRow(row)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            leftIcon={<Trash2 size={14} />}
                            onClick={() => handleDeleteRow(row.sprintId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </>
                )}
              </TableRow>
            ))}
            
            {/* New row being added */}
            {newRow && editRowData && (
              <TableRow>
                <TableCell>
                  <Input
                    name="sprintName"
                    value={editRowData.sprintName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="plannedPoints"
                    type="number"
                    value={editRowData.plannedPoints}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="completedPoints"
                    type="number"
                    value={editRowData.completedPoints}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  {editRowData.plannedPoints ? 
                    Math.round((editRowData.completedPoints / editRowData.plannedPoints) * 100) : 0}%
                </TableCell>
                <TableCell>
                  <Input
                    name="date"
                    type="date"
                    value={editRowData.date}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      leftIcon={<Save size={14} />}
                      onClick={handleSaveRow}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      leftIcon={<X size={14} />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VelocityDataTable;
