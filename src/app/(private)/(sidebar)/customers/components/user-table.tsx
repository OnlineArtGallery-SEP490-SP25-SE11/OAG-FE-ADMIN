'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Role } from '@/utils/enums';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/service/user-service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Filter, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role[] | Role;
  avatar?: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
};

const ROLES = ['admin', 'user', 'artist'] as const;
const ITEMS_PER_PAGE = 10; // Số lượng mục trên mỗi trang

export default function UserTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [banFilter, setBanFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await userService.getAllUser();
        console.log('API response:', response);
        
        if (!response) return [];
        
        if (response.data && Array.isArray(response.data)) {
          return response.data.map((user: User) => ({ ...user }));
        }
        
        if (Array.isArray(response)) {
          return response.map((user: User) => ({ ...user }));
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const getRolesArray = (role: Role[] | Role | undefined): Role[] => {
    if (!role) return [];
    return Array.isArray(role) ? role : [role];
  };

  useEffect(() => {
    if (users && Array.isArray(users)) {
      let filtered = users.filter(
        (user) =>
          (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      if (selectedRoles.length > 0) {
        filtered = filtered.filter(user => {
          const userRoles = getRolesArray(user.role);
          return userRoles.some(role => selectedRoles.includes(role));
        });
      }
      
      if (banFilter === 'active') {
        filtered = filtered.filter(user => !user.isBanned);
      } else if (banFilter === 'banned') {
        filtered = filtered.filter(user => user.isBanned);
      }
      
      setFilteredData(filtered);
      
      const newActiveFilters = [];
      if (selectedRoles.length > 0) newActiveFilters.push(`Roles: ${selectedRoles.join(', ')}`);
      if (banFilter !== 'all') newActiveFilters.push(`Status: ${banFilter === 'active' ? 'Active Only' : 'Banned Only'}`);
      setActiveFilters(newActiveFilters);
      
      // Reset về trang đầu khi thay đổi bộ lọc
      setCurrentPage(1);
    } else {
      setFilteredData([]);
    }
  }, [users, searchQuery, selectedRoles, banFilter]);

  // Tính toán phân trang
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const toggleRoleFilter = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRoles([]);
    setBanFilter('all');
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Error loading users: {(error as Error)?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className='w-full space-y-4'>
      {/* Các phần filter giữ nguyên */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search users...'
              className='pl-8 w-[300px]'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='gap-1'>
                <Filter className='h-4 w-4' />
                Filter
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* Dropdown content giữ nguyên */}
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-medium">By Role</DropdownMenuLabel>
                {ROLES.map(role => (
                  <DropdownMenuCheckboxItem
                    key={role}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => toggleRoleFilter(role)}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-medium">By Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={banFilter === 'all'}
                  onCheckedChange={() => banFilter !== 'all' && setBanFilter('all')}
                >
                  All Users
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={banFilter === 'active'}
                  onCheckedChange={() => setBanFilter(banFilter === 'active' ? 'all' : 'active')}
                >
                  Active Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={banFilter === 'banned'}
                  onCheckedChange={() => setBanFilter(banFilter === 'banned' ? 'all' : 'banned')}
                >
                  Banned Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="justify-center text-center"
                onClick={resetFilters}
              >
                Reset All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="flex gap-2">
            {activeFilters.map(filter => (
              <Badge key={filter} variant="outline" className="flex items-center gap-1">
                {filter}
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2" 
              onClick={resetFilters}
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className='border rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!currentItems || currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                      No users found {users?.length > 0 ? `(${users.length} users in unfiltered data)` : ''}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className='font-medium'>
                        <div className='flex items-center gap-2'>
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getRolesArray(user.role).map(role => (
                            <Badge key={role} variant="outline" className="capitalize">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>Manage Roles</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              {user.isBanned ? 'Unban User' : 'Ban User'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Phần phân trang */}
          {totalItems > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}