import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Calendar, Camera, Zap, Users, Plus, X } from 'lucide-react';
import { PageAura } from '../shared/PageAura';
import { toast } from 'sonner';
import { PRODUCTION_RESOURCES } from '../../data/mockData';
import { useNexus } from '../../data/store';
import type { ResourceBooking } from '../../data/types';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function getWeekDates(): { label: string; iso: string }[] {
  const today = new Date();
  const mon = new Date(today);
  mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return WEEK_DAYS.map((label, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return { label, iso: d.toISOString().split('T')[0] };
  });
}

const RESOURCE_COLORS: Record<string, string> = {
  'studio-a': '#A855F7',
  'studio-b': '#10B981',
  'studio-c': '#F59E0B',
  'equip-red': '#FF6B6B',
  'equip-drone': '#60A5FA',
  'equip-lights': '#4FD1C5',
};

function ResourceIcon({ type }: { type: string }) {
  if (type === 'studio') return <Camera size={13} />;
  if (type === 'equipment') return <Zap size={13} />;
  return <Layers size={13} />;
}

function BookingModal({
  resourceId,
  date,
  projects,
  onBook,
  onClose,
}: {
  resourceId: string;
  date: string;
  projects: { id: string; name: string }[];
  onBook: (projectId: string) => void;
  onClose: () => void;
}) {
  const [selectedProject, setSelectedProject] = useState('');
  const resource = PRODUCTION_RESOURCES.find(r => r.id === resourceId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 8 }}
        onClick={e => e.stopPropagation()}
        className="rounded-2xl p-6 flex flex-col gap-5 w-full max-w-sm"
        style={{ background: 'var(--surface)', border: '1px solid var(--hair)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 'calc(15px * var(--fs))' }}>Book Resource</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 'calc(12px * var(--fs))', marginTop: 2 }}>{resource?.name} · {date}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Assign to Project</div>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              style={{
                background: selectedProject === p.id ? 'rgba(var(--accent-rgb),0.1)' : 'var(--bg)',
                border: `1px solid ${selectedProject === p.id ? 'rgba(var(--accent-rgb),0.35)' : 'var(--hair)'}`,
                color: selectedProject === p.id ? 'var(--accent)' : 'var(--text)',
                borderRadius: 10,
                padding: '10px 14px',
                textAlign: 'left',
                fontSize: 'calc(13px * var(--fs))',
                cursor: 'pointer',
                fontWeight: selectedProject === p.id ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!selectedProject}
          onClick={() => selectedProject && onBook(selectedProject)}
          style={{
            background: selectedProject ? 'var(--accent)' : 'rgba(var(--accent-rgb),0.2)',
            border: 'none',
            color: selectedProject ? '#0B0B0F' : 'var(--accent)',
            borderRadius: 10,
            padding: '11px',
            fontWeight: 700,
            fontSize: 'calc(13px * var(--fs))',
            cursor: selectedProject ? 'pointer' : 'default',
          }}
        >
          Confirm Booking
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function BookingCard({ booking, projectName, color }: { booking: ResourceBooking; projectName: string; color: string }) {
  return (
    <div
      className="rounded-lg px-2.5 py-2 text-left w-full"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}30`,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div style={{ color, fontSize: 'calc(11px * var(--fs))', fontWeight: 700, lineHeight: 1.3 }}>{projectName}</div>
      <div style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))', marginTop: 1 }}>{booking.startTime}–{booking.endTime}</div>
      {booking.crew && booking.crew.length > 0 && (
        <div className="flex items-center gap-1 mt-1">
          <Users size={9} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))' }}>{booking.crew.length} crew</span>
        </div>
      )}
    </div>
  );
}

export function ProductionPage() {
  const { projects, bookings, applyAction } = useNexus();
  const weekDates = getWeekDates();
  const [modal, setModal] = useState<{ resourceId: string; date: string } | null>(null);

  const getBookings = (resourceId: string, date: string) =>
    bookings.filter(b => b.resourceId === resourceId && b.date === date);

  const hasConflict = (resourceId: string, date: string) =>
    getBookings(resourceId, date).length > 1;

  const handleBook = (resourceId: string, date: string, projectId: string) => {
    const resource = PRODUCTION_RESOURCES.find(r => r.id === resourceId);
    const label = applyAction({ type: 'book_studio', resource: resourceId, date, projectId, note: resource?.name });
    if (label) toast.success(label, { description: 'Axel has logged this booking.' });
    setModal(null);
  };

  const studios = PRODUCTION_RESOURCES.filter(r => r.type === 'studio');
  const equipment = PRODUCTION_RESOURCES.filter(r => r.type === 'equipment');

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg)', position: 'relative' }}>
      <PageAura color="#F97316" shape="triangle" position="top-left" />
      <PageAura color="#F97316" shape="oval" position="bottom-right" size={500} opacity={0.10} />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="px-8 pt-7 pb-5"
        style={{ borderBottom: '1px solid var(--hair)', position: 'relative', zIndex: 1 }}
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers size={18} style={{ color: '#F59E0B' }} />
              <h1 style={{ color: 'var(--text)', fontSize: 'calc(24px * var(--fs))', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Production</h1>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: 'calc(13px * var(--fs))' }}>
              Studio & equipment scheduling · {bookings.length} active bookings this week
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Calendar size={13} style={{ color: '#F59E0B' }} />
            <span style={{ color: '#F59E0B', fontSize: 'calc(12px * var(--fs))', fontWeight: 600 }}>
              Week of {weekDates[0].iso}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-8">

        {/* Studios */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Studios</span>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hair)' }}>
            {/* Day headers */}
            <div className="grid" style={{ gridTemplateColumns: '200px repeat(5, 1fr)', background: 'var(--surface-2)', borderBottom: '1px solid var(--hair)' }}>
              <div className="px-4 py-3" style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>Resource</div>
              {weekDates.map(({ label, iso }) => (
                <div key={iso} className="px-3 py-3 text-center" style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  <div style={{ opacity: 0.6 }}>{iso.slice(5)}</div>
                </div>
              ))}
            </div>
            {studios.map((resource, ri) => {
              const color = RESOURCE_COLORS[resource.id] ?? 'var(--accent)';
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ri * 0.06 }}
                  className="grid"
                  style={{ gridTemplateColumns: '200px repeat(5, 1fr)', borderBottom: ri < studios.length - 1 ? '1px solid var(--hair)' : 'none', background: 'var(--surface)' }}
                >
                  {/* Resource label */}
                  <div className="px-4 py-4 flex flex-col justify-center gap-1" style={{ borderRight: '1px solid var(--hair)' }}>
                    <div className="flex items-center gap-2">
                      <div className="rounded-md flex items-center justify-center" style={{ width: 24, height: 24, background: `${color}15` }}>
                        <ResourceIcon type={resource.type} />
                      </div>
                      <span style={{ color, fontWeight: 600, fontSize: 'calc(11px * var(--fs))' }}>{resource.name.split('—')[0].trim()}</span>
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))' }}>{resource.capacity} · ${resource.dailyRate}/day</div>
                  </div>

                  {/* Day cells */}
                  {weekDates.map(({ iso }) => {
                    const dayBookings = getBookings(resource.id, iso);
                    const conflict = hasConflict(resource.id, iso);
                    return (
                      <div
                        key={iso}
                        className="px-2 py-2 flex flex-col gap-1.5 min-h-[80px]"
                        style={{
                          borderRight: '1px solid var(--hair)',
                          background: conflict ? 'rgba(255,107,107,0.04)' : 'transparent',
                        }}
                      >
                        {dayBookings.map(bk => {
                          const proj = projects.find(p => p.id === bk.projectId);
                          return (
                            <BookingCard
                              key={bk.id}
                              booking={bk}
                              projectName={proj?.name ?? bk.projectId}
                              color={color}
                            />
                          );
                        })}
                        {!dayBookings.length && (
                          <button
                            onClick={() => setModal({ resourceId: resource.id, date: iso })}
                            className="w-full h-full flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                            style={{
                              border: '1px dashed var(--hair-2)',
                              color: 'var(--text-dim)',
                              fontSize: 'calc(11px * var(--fs))',
                              cursor: 'pointer',
                              background: 'transparent',
                              minHeight: 56,
                            }}
                          >
                            <Plus size={12} style={{ marginRight: 4 }} /> Book
                          </button>
                        )}
                        {conflict && (
                          <div style={{ color: '#FF6B6B', fontSize: 'calc(10px * var(--fs))', textAlign: 'center', fontWeight: 600 }}>⚠ Conflict</div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Equipment */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: 'var(--text)', fontSize: 'calc(13px * var(--fs))', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Equipment</span>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--hair)' }}>
            <div className="grid" style={{ gridTemplateColumns: '200px repeat(5, 1fr)', background: 'var(--surface-2)', borderBottom: '1px solid var(--hair)' }}>
              <div className="px-4 py-3" style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>Package</div>
              {weekDates.map(({ label, iso }) => (
                <div key={iso} className="px-3 py-3 text-center" style={{ color: 'var(--text-dim)', fontSize: 'calc(11px * var(--fs))' }}>
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  <div style={{ opacity: 0.6 }}>{iso.slice(5)}</div>
                </div>
              ))}
            </div>
            {equipment.map((resource, ri) => {
              const color = RESOURCE_COLORS[resource.id] ?? '#60A5FA';
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ri * 0.06 + 0.18 }}
                  className="grid"
                  style={{ gridTemplateColumns: '200px repeat(5, 1fr)', borderBottom: ri < equipment.length - 1 ? '1px solid var(--hair)' : 'none', background: 'var(--surface)' }}
                >
                  <div className="px-4 py-4 flex flex-col justify-center gap-1" style={{ borderRight: '1px solid var(--hair)' }}>
                    <div className="flex items-center gap-2">
                      <div className="rounded-md flex items-center justify-center" style={{ width: 24, height: 24, background: `${color}15` }}>
                        <ResourceIcon type={resource.type} />
                      </div>
                      <span style={{ color, fontWeight: 600, fontSize: 'calc(11px * var(--fs))' }}>{resource.name.split(' ').slice(0, 2).join(' ')}</span>
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: 'calc(10px * var(--fs))' }}>${resource.dailyRate}/day</div>
                  </div>
                  {weekDates.map(({ iso }) => {
                    const dayBookings = getBookings(resource.id, iso);
                    return (
                      <div key={iso} className="px-2 py-2 flex flex-col gap-1.5 min-h-[72px]" style={{ borderRight: '1px solid var(--hair)' }}>
                        {dayBookings.map(bk => {
                          const proj = projects.find(p => p.id === bk.projectId);
                          return (
                            <BookingCard key={bk.id} booking={bk} projectName={proj?.name ?? bk.projectId} color={color} />
                          );
                        })}
                        {!dayBookings.length && (
                          <button
                            onClick={() => setModal({ resourceId: resource.id, date: iso })}
                            className="w-full flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                            style={{
                              border: '1px dashed var(--hair-2)',
                              color: 'var(--text-dim)',
                              fontSize: 'calc(11px * var(--fs))',
                              cursor: 'pointer',
                              background: 'transparent',
                              minHeight: 48,
                            }}
                          >
                            <Plus size={12} style={{ marginRight: 4 }} /> Book
                          </button>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {modal && (
          <BookingModal
            resourceId={modal.resourceId}
            date={modal.date}
            projects={projects.filter(p => p.status !== 'completed').map(p => ({ id: p.id, name: p.name }))}
            onBook={(projectId) => handleBook(modal.resourceId, modal.date, projectId)}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
