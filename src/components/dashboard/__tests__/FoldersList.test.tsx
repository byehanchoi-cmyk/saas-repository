import { render, screen } from '@testing-library/react'
import { FoldersList } from '../FoldersList'
import { FolderResponseDTO } from '@/core/application/dtos/FolderDTO'

describe('FoldersList Component', () => {
    const mockFolders: FolderResponseDTO[] = [
        {
            id: '1',
            userId: 'user1',
            name: 'Personal',
            color: 'orange',
            icon: 'folder',
            noteCount: 12,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '2',
            userId: 'user1',
            name: 'Work Projects',
            color: 'blue',
            icon: 'work',
            noteCount: 45,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]

    it('renders the Folders section header', () => {
        render(<FoldersList folders={[]} />)
        expect(screen.getByText('Folders')).toBeInTheDocument()
    })

    it('renders a list of folders correctly', () => {
        render(<FoldersList folders={mockFolders} />)
        expect(screen.getByText('Personal')).toBeInTheDocument()
        expect(screen.getByText('12 notes')).toBeInTheDocument()

        expect(screen.getByText('Work Projects')).toBeInTheDocument()
        expect(screen.getByText('45 notes')).toBeInTheDocument()
    })

    it('renders empty state if no folders', () => {
        render(<FoldersList folders={[]} />)
        expect(screen.queryByText('Personal')).not.toBeInTheDocument()
    })
})
