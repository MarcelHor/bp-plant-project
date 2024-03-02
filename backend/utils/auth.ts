import prisma from "./db";
import bcrypt from 'bcrypt';

const ensureAdminUser = async () => {
    const adminUser = await prisma.user.findFirst();

    const password = await bcrypt.hash('admin', 10);

    if (!adminUser) {
        await prisma.user.create({
            data: {
                username: 'admin',
                password: password
            }
        });
    }
}

export {ensureAdminUser}