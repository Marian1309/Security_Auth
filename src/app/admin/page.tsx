'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

type Attempt = {
  id: string;
  email: string;
  ipAddress: string;
  success: boolean;
  createdAt: string;
};

const AdminPage = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      const res = await fetch('/api/auth/log-attempts');
      const data = await res.json();
      setAttempts(data);
    };

    fetchAttempts();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login Attempts</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {attempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>{attempt.email}</TableCell>
                  <TableCell>{attempt.ipAddress}</TableCell>
                  <TableCell>
                    <Badge variant={attempt.success ? 'default' : 'destructive'}>
                      {attempt.success ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(attempt.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
