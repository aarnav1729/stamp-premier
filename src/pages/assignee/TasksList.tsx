
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTasks, getProjects, getCustomers } from "@/lib/storage";
import { Task, Project, Customer } from "@/lib/data";
import Layout from "@/components/layout/Layout";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AssigneeTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Load all tasks
      const allTasks = getTasks();
      // Filter tasks assigned to this user
      const assignedTasks = allTasks.filter(task => 
        task.assignees.includes(user.id)
      );
      setTasks(assignedTasks);
      
      // Load projects and customers for reference
      setProjects(getProjects());
      setCustomers(getCustomers());
    }
  }, [user]);

  const getProjectTitle = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : "Unknown Project";
  };

  const getCustomerName = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return "Unknown Customer";
    
    const customer = customers.find(c => c.id === project.customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  return (
    <Layout allowedRoles={["assignee"]}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Tasks</h1>
        </div>
        
        {tasks.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{getProjectTitle(task.projectId)}</TableCell>
                    <TableCell>{getCustomerName(task.projectId)}</TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>
                      {task.status === "pending" && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Pending
                        </span>
                      )}
                      {task.status === "in-progress" && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          In Progress
                        </span>
                      )}
                      {task.status === "review" && (
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                          Under Review
                        </span>
                      )}
                      {task.status === "final-review" && (
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          Final Review
                        </span>
                      )}
                      {task.status === "closed" && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Closed
                        </span>
                      )}
                      {task.status === "rejected" && (
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          Rejected
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/assignee/task/${task.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600">No tasks assigned</h3>
            <p className="text-gray-500 mt-2">You don't have any tasks assigned to you</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssigneeTasks;
