'use client';
import { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid'; // New structure example, adjust as necessary

const Profile = () => {
  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Username: '',
    EventsAttended: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  interface Event {
    Name: string;
    StartDateTimeUtc: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  const BASE_URL = 'http://localhost:5110';

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      const userData = JSON.parse(userFromLocalStorage);
      setUser(userData);
      setEditedUser(userData);

      const userId = userData.Id;

      fetch(`${BASE_URL}/api/users/${userId}`)
        .then((response) => response.json())
        .then((userData) => {
          if (
            userData &&
            userData.EventsAttended &&
            userData.EventsAttended.length > 0
          ) {
            return Promise.all(
              userData.EventsAttended.map((eventId: string) =>
                fetch(`${BASE_URL}/api/events/${eventId}`).then((response) =>
                  response.json()
                )
              )
            );
          } else {
            return [];
          }
        })
        .then((eventsData) => {
          const now = new Date(); // Current date and time

          console.log('Now:', now);
          console.log('Events Data:', eventsData);

          const upcoming = eventsData.filter((event) => {
            // Use StartDateTimeUtc for parsing
            const eventDate = new Date(event.StartDateTimeUtc);
            console.log('Event Date:', eventDate, 'for Event:', event.Name);
            return eventDate > now;
          });

          const past = eventsData.filter((event) => {
            // Use StartDateTimeUtc for parsing
            const eventDate = new Date(event.StartDateTimeUtc);
            return eventDate < now;
          });

          console.log('PAST', past);
          console.log('UPCOMING', upcoming);
          setUpcomingEvents(upcoming);
          setPastEvents(past);
        })

        .catch((error) =>
          console.error('Error fetching events attended:', error)
        );
    }
  }, []);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleApplyChanges = async () => {
    // Update the user state with the edited user data
    setUser(editedUser);
    // Call the function to update the profile
    await handleProfileUpdate();
    // Turn off edit mode
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle profile updates
  const handleProfileUpdate = async () => {
    try {
      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        const userData = JSON.parse(userFromLocalStorage);
        const userId = userData.Id;

        const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
          method: 'PUT', // or 'PATCH' for partial updates
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FirstName: editedUser.FirstName,
            LastName: editedUser.LastName,
            Username: editedUser.Username, // This now references editedUser
            Email: editedUser.Email,
          }),
        });

        if (!response.ok) {
          // Handle any errors returned from the server
          throw new Error('Failed to update profile.');
        }

        // Update the user data in local storage
        localStorage.setItem('user', JSON.stringify(editedUser));
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <div
      className="mx-auto mt-24"
      style={{ minWidth: '800px', maxWidth: '800px', maxHeight: '800px' }}
    >
      {/* ... */}
      <div
        className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        style={{ minHeight: 'auto' }}
      >
        <div className="relative px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          {/* Edit and X Icon */}
          {editMode ? (
            <button
              onClick={handleEditClick}
              className="absolute top-5 right-5"
            >
              X
            </button>
          ) : (
            <PencilIcon
              className="absolute top-5 right-5 h-6 w-6 cursor-pointer"
              onClick={handleEditClick}
            />
          )}

          <h2 className="text-1xl md:text-2xl font-extrabold leading-tighter tracking-tighter mb-10 mt-16">
            Pronto
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Ticket
            </span>
          </h2>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tighter tracking-tighter mb-10 mt-8">
            {user.FirstName}'s Profile
          </h2>

          {/* User Info Display/Edit */}
          <div
            className="mx-auto mb-5.5 mt-4.5 grid grid-cols-1 md:grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]"
            style={{ maxHeight: '140px' }}
          >
            {editMode ? (
              // Edit Mode
              <>
                <div className="flex flex-col items-center justify-center gap-1 border-b md:border-b-0 md:border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="text-sm">Name</span>
                  <input
                    type="text"
                    name="FirstName"
                    value={editedUser.FirstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="text-center"
                  />
                  <input
                    type="text"
                    name="LastName"
                    value={editedUser.LastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="text-center"
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-1 border-b md:border-b-0 md:border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="text-sm">Email</span>
                  <input
                    type="text"
                    name="Email"
                    value={editedUser.Email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="text-center"
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="text-sm">Username</span>
                  <input
                    type="text"
                    name="Username"
                    value={editedUser.Username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="text-center"
                  />
                </div>
              </>
            ) : (
              // View Mode
              <>
                <div className="flex flex-col items-center justify-center gap-1 border-b md:border-b-0 md:border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="text-sm">Name</span>
                  <span className="font-semibold text-black dark:text-white">
                    {user.FirstName} {user.LastName}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 border-b md:border-b-0 md:border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="text-sm">Email Address</span>
                  <span className="font-semibold text-black dark:text-white">
                    {user.Email}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="text-sm">Username</span>
                  <span className="font-semibold text-black dark:text-white">
                    @{user.Username}
                  </span>
                </div>
              </>
            )}
          </div>
          {editMode && (
            <div className="flex justify-center mt-4 mb-0">
              <button
                onClick={handleApplyChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Apply
              </button>
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-col items-center pb-8">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <div className="mt-3 flex justify-center gap-2 flex-wrap mb-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="rounded bg-gray-200 px-4 py-1 text-center"
              >
                {event.Name}
              </div>
            ))}
          </div>
          <h3 className="text-lg font-semibold">Events Attended</h3>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {pastEvents.map((event, index) => (
              <div
                key={index}
                className="rounded bg-gray-200 px-4 py-1 text-center"
              >
                {event.Name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
