# Preventing Double-Booking & Race Conditions

This service ensures data integrity during high-concurrency ticket sales across multiple API instances.

# The Problem: Why Serializable Isolation Failed
Initially, i used Serializable Isolation, which uses an optimistic approach. When two instances read the same seat simultaneously, the database doesn't block them immediately. Instead, it waits until the "commit" phase to check for conflicts, often killing both transactions with 40001 Serialization Errors. This caused crashes during debugging and forced complex retry loops under high load.



# The Solution: Pessimistic Locking (FOR UPDATE)
i shifted to a pessimistic strategy using  'SELECT ... FOR UPDATE' . This acts as a physical gatekeeper:

Queueing: If Instance A locks a seat, Instance B is paused by the database until Instance A finishes.

Validation: Once Instance B is "released," it re-checks the seat status. It sees the updated is_booked value and returns a clean error instead of a duplicate booking.

# Atomic Integrity
Everything is wrapped in a Database Transaction. If any step fails from stock decrement to sale creation—the Rollback command restores all rows. This prevents "ghost bookings" ensuring seats are only taken if the payment and inventory updates succeed simultaneously.