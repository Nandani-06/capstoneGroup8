import React, { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: { time: string; members: string; schools: string; occupation: string; location: string }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [membersFilter, setMembersFilter] = useState('default');
  const [schoolsFilter, setSchoolsFilter] = useState('default');
  const [occupationFilter, setOccupationFilter] = useState('default');
  const [locationFilter, setLocationFilter] = useState('default');

  const handleTimeChange = (time: string) => {
    setTimeFilter(time);
    onFilterChange({ time, members: membersFilter, schools: schoolsFilter, occupation: occupationFilter, location: locationFilter });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, type: 'members' | 'schools' | 'occupation' | 'location') => {
    const value = event.target.value;
    if (type === 'members') setMembersFilter(value);
    if (type === 'schools') setSchoolsFilter(value);
    if (type === 'occupation') setOccupationFilter(value);
    if (type === 'location') setLocationFilter(value);

    onFilterChange({ time: timeFilter, members: type === 'members' ? value : membersFilter, schools: type === 'schools' ? value : schoolsFilter, occupation: type === 'occupation' ? value : occupationFilter, location: type === 'location' ? value : locationFilter });
  };

  return (
    <div className="mb-6">
      {/* Time Filters */}
      <div className="flex space-x-4 mb-4">
        {['today', 'yesterday', 'last 7 days', 'last 30 days', 'last month'].map((time) => (
          <button
            key={time}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeFilter === time ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleTimeChange(time)}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Attribute Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-6">
        {/* Members Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Members</label>
          <select
            value={membersFilter}
            onChange={(e) => handleSelectChange(e, 'members')}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 w-full"
          >
            <option value="default" disabled>
              Select Members
            </option>
            <option value="member1">Member 1</option>
            <option value="member2">Member 2</option>
            <option value="member3">Member 3</option>
          </select>
        </div>

        {/* Schools Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schools</label>
          <select
            value={schoolsFilter}
            onChange={(e) => handleSelectChange(e, 'schools')}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 w-full"
          >
            <option value="default" disabled>
              Select Schools
            </option>
            <option value="school1">School 1</option>
            <option value="school2">School 2</option>
            <option value="school3">School 3</option>
          </select>
        </div>

        {/* Occupation Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
          <select
            value={occupationFilter}
            onChange={(e) => handleSelectChange(e, 'occupation')}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 w-full"
          >
            <option value="default" disabled>
              Select Occupation
            </option>
            <option value="occupation1">Occupation 1</option>
            <option value="occupation2">Occupation 2</option>
            <option value="occupation3">Occupation 3</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            value={locationFilter}
            onChange={(e) => handleSelectChange(e, 'location')}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 w-full"
          >
            <option value="default" disabled>
              Select Location
            </option>
            <option value="location1">Location 1</option>
            <option value="location2">Location 2</option>
            <option value="location3">Location 3</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filter;